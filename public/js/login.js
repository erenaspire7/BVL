var element = document.getElementById('select-num');

element.addEventListener("click", function() {
    if(element.value == "LS") {
        var html = 
        `
            <input type="number" aria-label="user-phone-number" class="form-control round-edit" name="userPnum" id="p-num" minlength="8" maxlength="8" required>
        `;

        var item = document.getElementById('select-num').nextElementSibling.firstElementChild;
        item.insertAdjacentHTML("afterend", html);
        item.remove();
    }
});