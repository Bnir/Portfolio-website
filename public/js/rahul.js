document.addEventListener('mousemove', (e) => {
  const lightEffect = document.querySelector('.light-effect');

  // Update the position of the light effect based on cursor position
  lightEffect.style.display = "block";
  lightEffect.style.left = `${e.clientX}px`;
  lightEffect.style.top = `${e.clientY}px`;
});


let left = document.querySelector('.leftside');
let right = document.querySelector('.rightside');

left.addEventListener('wheel', (event) => {
  right.scrollTop += event.deltaY;
});


let section = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('nav a');


right.addEventListener('wheel', () => {
  section.forEach(sec => {
    let top = right.scrollTop + 200;
    let offset = sec.offsetTop;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(links => {
        links.classList.add('inactive');
        links.classList.remove('active');
        document.querySelector('nav a[href="#' + id + '"]').classList.add('active');
        document.querySelector('nav a[href="#' + id + '"]').classList.remove('inactive');
      })
    }
  })
});

left.addEventListener('wheel', () => {
  section.forEach(sec => {
    let top = right.scrollTop;
    let offset = sec.offsetTop;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(links => {
        links.classList.add('inactive');
        links.classList.remove('active');
        document.querySelector('nav a[href="#' + id + '"]').classList.add('active');
        document.querySelector('nav a[href="#' + id + '"]').classList.remove('inactive');
      })
    }
  })
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    // event.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    console.log(targetId);
    console.log(targetSection);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    setTimeout(() => {
      navLinks.forEach(links => {
        links.classList.add('inactive');
        links.classList.remove('active');
      });
      event.target.classList.remove('inactive')
      event.target.classList.add('active');
    }, 100);
  })
});