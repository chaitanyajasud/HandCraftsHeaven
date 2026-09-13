import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const catalogPath = `${import.meta.env.BASE_URL}sarees/products.csv`
const whatsappNumber = ''
const fallbackAccent = ['#e6ad45', '#324d69', '#d9cbb4', '#bd5262', '#87906b']

const parseCsv = (text) => {
  const rows = []
  let row = []
  let value = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    const nextCharacter = text[index + 1]
    if (character === '"' && quoted && nextCharacter === '"') {
      value += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(value.trim())
      value = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && nextCharacter === '\n') index += 1
      row.push(value.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      value = ''
    } else {
      value += character
    }
  }

  if (value || row.length) {
    row.push(value.trim())
    if (row.some(Boolean)) rows.push(row)
  }

  if (rows.length < 2) return []
  const headers = rows[0].map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ''))
  return rows.slice(1).map((values, rowIndex) => {
    const product = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']))
    const price = Number(product.productprice.replace(/[^0-9.-]/g, '')) || 0
    const categoryText = `${product.productname} ${product.productdetails}`.toLowerCase()
    const category = categoryText.includes('sunflower')
      ? 'Sunflower bouquets'
      : categoryText.includes('bouquet')
        ? 'Flower bouquets'
        : 'Decorative garlands'
    return {
      id: product.productnumber || `${rowIndex + 1}`,
      name: product.productname || 'Unnamed saree',
      craft: product.productdetails || 'Handcrafted saree',
      details: product.productdetails || 'A considered piece, woven in small batches and finished by hand.',
      quantity: product.productquantity || 'Available',
      price,
      category,
      tone: product.productname || 'Saree',
      image: `${import.meta.env.BASE_URL}sarees/${product.productimagename}`,
      accent: fallbackAccent[rowIndex % fallbackAccent.length],
      tag: Number(product.productquantity) === 0 ? 'Sold out' : 'Available',
    }
  }).filter((product) => product.image !== './sarees/')
}

const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

const buyOnWhatsApp = (saree) => {
  const message = [
    'Hello, I would like to buy this saree:',
    `Product number: ${saree.id}`,
    `Name: ${saree.name}`,
    `Details: ${saree.details}`,
    `Available quantity: ${saree.quantity}`,
    `Price: ${formatPrice(saree.price)}`,
  ].join('\n')
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

function App() {
  const [sarees, setSarees] = useState([])
  const [catalogState, setCatalogState] = useState('loading')
  const [activeFilter, setActiveFilter] = useState('All bouquets')
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [liked, setLiked] = useState([])
  const [selected, setSelected] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    fetch(catalogPath)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${catalogPath}`)
        return response.text()
      })
      .then((csv) => {
        setSarees(parseCsv(csv))
        setCatalogState('ready')
      })
      .catch(() => setCatalogState('error'))
  }, [])

  const filters = ['All bouquets', 'Flower bouquets', 'Sunflower bouquets', 'Decorative garlands']
  const filteredSarees = sarees.filter((saree) => {
    const matchesFilter = activeFilter === 'All bouquets' || saree.category === activeFilter
    return matchesFilter && saree.name.toLowerCase().includes(search.toLowerCase())
  })

  const toggleLike = (id) => setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Saanjh Studio home"><span>Handcraft Heaven </span><small>STUDIO / 2024</small></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#collection">The collection</a>
          <a href="#story">Our story</a>
          <a href="#journal">Journal</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search collection">⌕</button>
          <button className="bag-button" onClick={() => setCartCount(cartCount + 1)} aria-label="Shopping bag">Bag <span>{cartCount.toString().padStart(2, '0')}</span></button>
        </div>
      </header>

      {searchOpen && <div className="search-drawer"><label htmlFor="search">Search the collection</label><input id="search" autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try ‘silk’ or ‘indigo’" /></div>}

      <main id="top">
        <section className="hero" style={{ backgroundImage: "url('./sarees/Background.jpg')" }} aria-labelledby="hero-title">
          <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> Handcrafted artificial flowers</p>
              <h1 id="hero-title">Bring nature<br /><em>home.</em></h1>
              <p className="hero-intro">Handcrafted artificial flowers that bring lasting color, texture, and a little wonder to every room.</p>
            <a className="text-link" href="#collection">Explore the edit <span>↘</span></a>
          </div>
          <div className="hero-aside"><span>01</span><span className="aside-rule" /><span>06</span></div>
        </section>


        <section className="collection" id="collection">
          <div className="section-heading"><div><p className="eyebrow">The edit / 01</p><h2>Pieces with<br /><em>presence.</em></h2></div><p className="section-note">Six handpicked stories,<br />ready to be yours.</p></div>
          <div className="filter-row"><div className="filters">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><span>{catalogState === 'loading' ? 'Loading...' : `${filteredSarees.length} bouquets`}</span></div>
          {catalogState === 'error' && <p className="catalog-message">The collection could not be loaded. Check `public/sarees/products.csv`.</p>}
          <div className="product-grid">{filteredSarees.map((saree, index) => <article className={`product-card card-${index + 1}`} key={saree.id}>
            <button className="product-image" onClick={() => setSelected(saree)} style={{ '--accent': saree.accent }} aria-label={`View ${saree.name}`}><img src={saree.image} alt={`${saree.name} saree`} onError={(event) => { event.currentTarget.style.display = 'none' }} />
            <span className="image-fallback">{saree.tone}
            <small>Place image in /public/sarees</small>
            </span><span className="tag">{saree.tag}</span>
            <span className="view-mark">+</span></button>
            <div className="product-meta"><div><h3>{saree.name}</h3><p>{saree.details}</p><small>Qty: {saree.quantity}</small></div><button className={`heart ${liked.includes(saree.id) ? 'liked' : ''}`} onClick={() => toggleLike(saree.id)} aria-label={`${liked.includes(saree.id) ? 'Remove' : 'Add'} ${saree.name} ${liked.includes(saree.id) ? 'from' : 'to'} wishlist`}>{liked.includes(saree.id) ? '♥' : '♡'}</button><strong>{formatPrice(saree.price)}</strong></div>
          </article>)}</div>
        </section>

        <section className="journal" id="journal"><div><p className="eyebrow">From the journal / 03</p><h2>The art of<br /><em>taking your time.</em></h2></div><div className="journal-copy"><p>Flowers are more than decoration. They are a simple way to bring color, warmth, and joy into your everyday spaces.</p><a className="text-link" href="#story">Read the note <span>↘</span></a></div></section>
      </main>

      <footer><a className="wordmark" href="#top"><span>HandCraft Heaven</span><small>FLOWER STUDIO / 2024</small></a><p>Handcrafted artificial flowers<br />Made to brighten every space.</p><span>© HandCraft Heaven</span></footer>

      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="quick-view" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setSelected(null)} aria-label="Close quick view">×</button><div className="quick-image" style={{ '--accent': selected.accent }}><img src={selected.image} alt={selected.name} onError={(event) => { event.currentTarget.style.display = 'none' }} /><span className="image-fallback">{selected.tone}</span></div><div className="quick-copy"><p className="eyebrow">{selected.tag} / Product {selected.id}</p><h2>{selected.name}</h2><strong>{formatPrice(selected.price)}</strong><p>{selected.details}</p><p className="quantity">Quantity: {selected.quantity}</p><button className="add-button" onClick={() => buyOnWhatsApp(selected)}>Buy on WhatsApp <span>↗</span></button></div></div></div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)