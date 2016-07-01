var userPhone = document.getElementById("userPhone"),
    userPass = document.getElementById("userPass"),
    submit = document.getElementById("submit");
submit.onclick = function () {
    var obj = {}, objStr = '';
    obj.phone = userPhone.value.replace(/^ +| +$/g, "");
    obj.pass = userPass.value.replace(/^ +| +$/g, "");
    objStr = JSON.stringify(obj);
    ajax({
        url: "/add",
        type: "post",
        data: objStr,
        success: function (data) {
            alert(data["message"]);
            if (data["code"] == 0) {
                window.location.href = "load.html";
            }
        }
    });
};