fetch('/components/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
    document.getElementById(activePage).classList.add("active");
  });

fetch('/components/footer.html')
  .then(response => response.text())
  .then(data => document.getElementById('footer').innerHTML = data);
