
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const moment = require('moment');
moment().format('Do MMMM YYYY'); 
const  yargs  =  require ( 'yargs/yargs' ) 
const  { hideBin }  =  require ( 'yargs/helpers' )

let today = new Date()
const argv = process.argv.slice(2)

yargs(hideBin(process.argv))
.command('current', 'Посмотреть время', () => {

    if (argv[1] === '--y'  || argv[1] === '--year' ) 
    {
        console.log(today.getFullYear())
    }
    else if (argv[1] === '--d' || argv[1] === '--date')
    {
        console.log(today.getDate())
    }
    else if (argv[1] === '--m' || argv[1] === '--month')
    {
        console.log(moment().format('MM'))
    }
    else{
        console.log(moment().format('YYYY MM DD'))
    }
  })


.command('add', 'Добавить время', () => {
let num = Number(argv[2])
if (argv[1] === '--y'  || argv[1] === '--year' ) 
{
    console.log(moment().add(num, 'years').format('YYYY MM DD'))
}
else if (argv[1] === '--d' || argv[1] === '--date')
{
    console.log(moment().add(num, 'days').format('YYYY MM DD'))
}
else if (argv[1] === '--m' || argv[1] === '--month')
{
    console.log(moment().add(num, 'month').format('YYYY MM DD'))
}
else{
    console.log(moment().format('YYYY MM DD'))
}
})


.command('sub', 'Отнять время', () => {
    let num = Number(argv[2])
    if (argv[1] === '--y'  || argv[1] === '--year' ) 
    {
        console.log(moment().subtract(num, 'years').format('YYYY MM DD'))
    }
    else if (argv[1] === '--d' || argv[1] === '--date')
    {
        console.log(moment().subtract(num, 'days').format('YYYY MM DD'))
    }
    else if (argv[1] === '--m' || argv[1] === '--month')
    {
        console.log(moment().subtract(num, 'month').format('YYYY MM DD'))
    }
    else{
        console.log(moment().format('YYYY MM DD'))
    }
    })

.parse();


console.log('========================Задание 2=====================')

let genNum = Math.round(Math.random() * 100)

console.log(`Ответ: "${genNum}"\n`)
const game = () => {
    readline.question('Загадано число в диапазоне от 0 до 100: ', user_number => {
        user_number = parseInt(user_number)
        if (user_number === genNum) {
            console.log(`ВЫ УГАДАЛИ ЧИСЛО "${genNum}"!!!`)
            readline.close()
        } else if (user_number > genNum) {
            console.log(`Число "${user_number}" больше!\n`)
             game()
        } else if (user_number < genNum) {
            console.log(`Число "${user_number}" меньше!\n`)
            game()
        } else {
            readline.close()
        }

    })
}

game()