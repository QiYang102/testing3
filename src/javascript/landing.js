document.addEventListener('DOMContentLoaded', (e) => {
  const contentSplit = new SplitText('.content p ', { type: 'lines' });

  gsap.from(contentSplit.lines, {
    opacity: 0,
    yPercent: 100,
    duration: 1.5,
    ease: 'expo.out',
    stagger: 0.06,
    delay: 0.1,
  });

  document.getElementById("exploreBtn").addEventListener('click', () => {
    sessionStorage.setItem('from_main','1');
    window.location.href = "main2.html";
  })
})