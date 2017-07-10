function loginCustomer(e) {
    const email = $('input[name=email]').val();
    const psw = $('input[name=psw]').val();
    
    $.post('http://localhost:3000/loginUser', {email, psw}, response => {
        if(response)
            alert('Login efetuado com sucesso');
        else
            alert('Dados não encontrados');
    });
}
