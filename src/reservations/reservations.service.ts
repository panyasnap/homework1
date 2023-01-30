import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { RoomService } from 'src/room/room.service';
import { TID } from 'src/room/interfaces/hotel.room.interfaces';
import { HotelRoom } from 'src/room/schemas/hotelRoom.schemas';
import { Role } from 'src/users/enums/roles.enum';
import { User } from 'src/users/schemas/user.schemas';
import { ReservationDto } from './dto/reservation.dto';
import { Reservations } from './schemas/reservations.schemas';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservations.name)
    private reservationsModel: Model<Reservations>,
    private hotelRoomService: RoomService,
    @InjectConnection() private connection: Connection,
  ) {}

  async addReservation(data: ReservationDto, id: TID) {
    try {
      const checkDateReservation = await this.reservationsModel.find({
        dateStart: {
          $lte: new Date(data.dateEnd),
          $gte: new Date(data.dateStart),
        },
      });

      if (checkDateReservation.length) {
        throw new BadRequestException('На эти даты уже есть бронь');
      }

      const hotelRoom = await this.hotelRoomService.getHotelRoom(
        data.hotelRoom,
      );
      if (!hotelRoom || !hotelRoom.isEnabled) throw new BadRequestException();

      const newReservation = new this.reservationsModel({
        ...data,
        roomId: data.hotelRoom,
        userId: id,
        hotelId: hotelRoom.hotel,
      });
      await newReservation.save();
      return newReservation;
    } catch (error) {
      return error;
    }
  }

  async getReservations(id: TID) {
    try {
      return await this.reservationsModel
        .find({ userId: id })
        .select('-__v')
        .select('-updatedAt')
        .select('-createdAt')
        .select('-userId')
        .select('-_id');
    } catch (error) {
      return error;
    }
  }

  async removeReservation(id: TID, user: User & { _id: TID }) {
    try {
      const room = await this.reservationsModel.findById(id);

      /** 400 - если брони с указанным ID не существует */
      if (!room) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
      /** 403 - если ID текущего пользователя не совпадает с ID пользователя в брони */
      if (room.userId.toString() !== user._id.toString()) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      return await this.reservationsModel.deleteOne({ _id: id });
    } catch (error) {
      return error;
    }
  }

  async removeManagerReservation(id: TID) {
    try {
      const room = await this.reservationsModel.findById(id);

      /** 400 - если брони с указанным ID не существует */
      if (!room) throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);

      return await this.reservationsModel.deleteOne({ _id: id });
    } catch (error) {
      return error;
    }
  }

  async getUserReservations(userId: string) {
    try {
      return await this.reservationsModel.find({ userId });
    } catch (error) {
      return error;
    }
  }
}
