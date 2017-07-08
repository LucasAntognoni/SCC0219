'use strict';

const signUp = () => {
    const name = $('input[name=name]').val();
    const pic = $('input[name=pic]').val();
    const phone = $('input[name=phone]').val();
    const address = $('input[name=address]').val();
    const email = $('input[name=email]').val();
    const psw = $('input[name=psw]').val();
    const psw_repeat = $('input[name=psw-repeat]').val();

    if(psw === psw_repeat)
        $.post('http://localhost:3000/addUser', {name, phone, pic, address, email, psw});

    else
        alert('Senhas diferentes!');    
}
