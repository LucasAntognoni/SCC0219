$(document).ready(() => {
    $.post('http://localhost:3000/showCustomers', {}, response => {
        Promise.all(response.map(element => {
            return `<tr>\n<td><span>${element.name}</span></td>\n\
<td><span>${element.email}</span></td>\n</tr>`;
        })).then(customers => {
            $('#customers').html(customers);
        });
    });
});
