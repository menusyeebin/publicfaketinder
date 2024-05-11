
// Tinder

let imgCount = 0
const appLink = 'pablorotten.github.io/fake-tinder'
const profiles = [
  {img: `images/profiles/chickpeas.png`, name: 'Chickpeas', age: '7.75g/100g', distance: 'Your local grocery store', slogan: 'I’ll get your bowels moving regularly', infoa: 'Broken down by ‘good’ bacteria in the gut', infob: 'Helps lower cholesterol'},
  {img: `images/profiles/leek.png`, name: 'Leek', age: '1.8g/100g', distance: 'Where the broccoli is', slogan: 'I’ll make you feel full without the extra kilos', infoa: 'Low in calories', infob: 'Full of readily fermentable fibre'},
  {img: `images/profiles/wchoc.png`, name: 'White Chocolate', age: '0.2g/100g', distance: 'Any store close to you', slogan: 'I know you Dream of me', infoa: 'Full of fats and sugar', infob: 'Basically fibre free'},
  {img: `images/profiles/oats.jpg`, name: 'Oats', age: '9.26g/100g', distance: 'Whenever, wherever', slogan: 'Take me hot n fresh, or cold, raw n overnight', infoa: 'Contains beta-glucan, a soluble fibre helping', infob: 'to lower cholesterol reabsorption'},
  {img: `images/profiles/mucake.jpg`, name: 'Chocolate Mudcake', age: '2.3g/100g', distance: 'Anywhere they sell fruit and dish soap', slogan: 'Thick, rich and dark brown', infoa: 'Boasts a 2 star health rating', infob: 'Healthy with the sugar and fats aside'},
  {img: `images/profiles/pear.jpg`, name: 'Pear', age: '3.1g/100g', distance: 'Whenever, wherever', slogan: 'Pear me with breakfast', infoa: 'Soluble & Insoluble Fibre, Sorbitol and Fructose', infob: 'Vitamin C and Low GI too'},
  {img: `images/profiles/brice.jpg`, name: 'Brown Rice', age: '1.8g/100g', distance: 'In the pantry', slogan: 'Rice and shine, white rice but husky', infoa: 'Dietary staple for thousands of years', infob: 'Brings in Selenium, Magnesium and Folate'},
  {img: `images/profiles/pmix.png`, name: 'Party Mix', age: '0g/100g', distance: 'Maybe even in this room', slogan: 'Party today, farty tomorrow', infoa: 'An alluring combo of sugars, syrups and colours', infob: 'Essentially no nutritional value'},
  {img: `images/profiles/chip.png`, name: 'Hot Chips', age: '3.8g/100g', distance: 'On the fried side', slogan: 'Fresh out the fryer', infoa: 'Fibre? Yes. What else?', infob: 'Fats, Carbs and a little Vitamin C'},
]

const frame = document.body.querySelector('.frame')

profiles.forEach(profile => appendCard(profile))

let current = frame.querySelector('.card:last-child')
let likeText = current.children[0]
let startX = 0, startY = 0, moveX = 0, moveY = 0
initCard(current)

document.querySelector('#like').onclick = () => {
  moveX = 1
  moveY = 0
  complete()
}
document.querySelector('#hate').onclick = () => {
  moveX = -1
  moveY = 0
  complete()
}
document.querySelector('#link').onclick = () => {
  $.notify("Link copied in the clipboard", "success");
  navigator.clipboard.writeText(`https://${appLink}`);
}

function appendCard(profile) {
  const firstCard = frame.children[0]
  const newCard = document.createElement('div')
  newCard.className = 'card'
  newCard.style.backgroundImage = `url(${profile.img})`
  newCard.innerHTML = `
    <div class="is-like">LIKE</div>
    <div class="bottom">
      <div class="title">
        ${profile.name === 'link' ? `<span><a href="javascript:void(0)" id="link" class="link">${appLink}<span></a>` : `<span>${profile.name}</span><span>${profile.age}</span>`}
      </div>
      <div class="info">
        <span>${profile.slogan}</span><br>
        <span>${profile.infoa}</span><br>
        <span>${profile.infob}</span>
      </div>
    </div>
        `
  if (firstCard) frame.insertBefore(newCard, firstCard)
  else frame.appendChild(newCard)
  imgCount++
}

function initCard(card) {
  card.addEventListener('pointerdown', onPointerDown)
}

function setTransform(x, y, deg, duration) {
  current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`
  likeText.style.opacity = Math.abs((x / innerWidth * 2.1))
  likeText.className = `is-like ${x > 0 ? 'like' : 'nope'}`
  if (duration) current.style.transition = `transform ${duration}ms`
}

function onPointerDown({clientX, clientY}) {
  startX = clientX
  startY = clientY
  current.addEventListener('pointermove', onPointerMove)
  current.addEventListener('pointerup', onPointerUp)
  current.addEventListener('pointerleave', onPointerUp)
}

function onPointerMove({clientX, clientY}) {
  moveX = clientX - startX
  moveY = clientY - startY
  setTransform(moveX, moveY, moveX / innerWidth * 50)
}

function onPointerUp() {
  current.removeEventListener('pointermove', onPointerMove)
  current.removeEventListener('pointerup', onPointerUp)
  current.removeEventListener('pointerleave', onPointerUp)
  if (Math.abs(moveX) > frame.clientWidth / 2) {
    current.removeEventListener('pointerdown', onPointerDown)
    complete()
  } else cancel()
}

function complete() {
  const flyX = (Math.abs(moveX) / moveX) * innerWidth * 1.3
  const flyY = (moveY / moveX) * flyX
  setTransform(flyX, flyY, flyX / innerWidth * 50, innerWidth)

  const prev = current
  const next = current.previousElementSibling
  if (next) initCard(next)
  current = next
  likeText = current.children[0]
  appendCard(profiles[imgCount % profiles.length])
  setTimeout(() => frame.removeChild(prev), innerWidth)
}

function cancel() {
  setTransform(0, 0, 0, 100)
  setTimeout(() => current.style.transition = '', 100)
}
