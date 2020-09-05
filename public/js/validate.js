var checkForm = function() {
    pin_1 = document.getElementById('user-pin').value;
    pin_2 = document.getElementById('confirm-user-pin').value;

    if (pin_1 == pin_2) {
        return true;
    } else {
        $("#errorModal").modal()
        return false;
    } 
}

var element = document.getElementById('select-num');

element.addEventListener("click", function() {
    if(element.value == "LS") {
        var html = 
        `
            <input type="number" aria-label="user-phone-number" class="form-control round-edit" name="pNum" id="p-num" minlength="8" maxlength="8" required>
        `;

        var item = document.getElementById('select-num').nextElementSibling.firstElementChild;
        item.insertAdjacentHTML("afterend", html);
        item.remove();
    }
});