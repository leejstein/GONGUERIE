async function register() {
  let idText = document.querySelector("#userIDinput").value;
  let pwText = document.querySelector("#userPWinput").value;

  var bodyJSON = {
    id: idText,
    pw: pwText
  };
  const response = await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(bodyJSON)
  });
  if(response.status == 200)
    window.location.href = "/";
  else 
    alert("Malformed Request");
}
