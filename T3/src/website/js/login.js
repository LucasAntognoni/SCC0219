function loginCustomer(e) {
    const email = $('input[name=uname]').val();
    const psw = $('input[name=psw]').val();
    
    $.post('http://localhost:3000/loginUser', {email, psw}, success => {
        console.log(success);
    });
}
