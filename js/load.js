var userPhone = document.getElementById("userPhone"),
    userPass = document.getElementById("userPass"),
    load = document.getElementById("load");
load.onclick = function () {
    var obj = {}, objStr = '';
    console.log(userPhone.value);
    obj.phone = userPhone.value.replace(/^ +| +$/g, "");
    obj.pass = userPass.value.replace(/^ +| +$/g, "");
    objStr = JSON.stringify(obj);
    ajax({
        url: "/loading",
        type: "post",
        data: objStr,
        success: function (data) {
            console.log(data);
            alert(data["message"]);
            if (data["code"] == 0) {
                window.location.href = "index.html";
            }
        }
    });
};