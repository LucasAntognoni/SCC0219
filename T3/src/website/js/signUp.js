'use strict';

const signUp = () => {
    const name = $('input[name=name]').val();
    const phone = $('input[name=phone]').val();
    const address = $('input[name=address]').val();
    const email = $('input[name=email]').val();
    const psw = $('input[name=psw]').val();
    const psw_repeat = $('input[name=psw-repeat]').val();

    if(psw === psw_repeat)
        $.post('http://localhost:3000/addUser', {name, phone, address, email, psw}, response => {
            if(response)
                alert('Usuário cadastrado');

            else
                alert('Erro no servidor');            
        });

    else
        alert('Senhas diferentes!');    
}
