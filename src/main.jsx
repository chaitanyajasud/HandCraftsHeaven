import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const sarees = [
  { id: 1, name: 'Gulmohar Dawn', craft: 'Handwoven Silk', price: 18900, tone: 'Marigold', image: '/sarees/gulmohar-dawn.jpg.jpeg', accent: '#e6ad45', tag: 'New' },
  { id: 2, name: 'Indigo Monsoon', craft: 'Chanderi Cotton', price: 12400, tone: 'Indigo', image: '/sarees/images.jpeg', accent: '#324d69', tag: 'Bestseller' },
  { id: 3, name: 'Mogra After Rain', craft: 'Tussar Silk', price: 21600, tone: 'Ivory', image: '/sarees/images%20(1).jpeg', accent: '#d9cbb4', tag: 'Limited' },
  { id: 4, name: 'Rani Gulab', craft: 'Banarasi Katan', price: 28900, tone: 'Rose', image: '/sarees/images%20(2).jpeg', accent: '#bd5262', tag: 'New' },
  { id: 5, name: 'Neem Shade', craft: 'Linen Silk', price: 9800, tone: 'Olive', image: '/sarees/images%20(3).jpeg', accent: '#87906b', tag: 'Everyday' },
]

const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

function App() {
  const [activeFilter, setActiveFilter] = useState('All pieces')
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [liked, setLiked] = useState([])
  const [selected, setSelected] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  const filters = ['All pieces', 'Silk', 'Cotton', 'Everyday']
  const filteredSarees = sarees.filter((saree) => {
    const matchesFilter = activeFilter === 'All pieces'
      || (activeFilter === 'Silk' && saree.craft.toLowerCase().includes('silk'))
      || (activeFilter === 'Cotton' && saree.craft.toLowerCase().includes('cotton'))
      || (activeFilter === 'Everyday' && saree.tag === 'Everyday')
    return matchesFilter && saree.name.toLowerCase().includes(search.toLowerCase())
  })

  const toggleLike = (id) => setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Saanjh Studio home"><span>Krushna Collection</span><small>STUDIO / 2024</small></a>
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
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> The new heirloom</p>
            <h1 id="hero-title">Woven for<br /><em>your</em> becoming.</h1>
            <p className="hero-intro">Sarees that hold a little bit of where you have been, and leave room for everything you are becoming.</p>
            <a className="text-link" href="#collection">Explore the edit <span>↘</span></a>
          </div>
          <div className="hero-art" aria-label="Saffron silk saree detail">
            <div className="sun-disc" />
            <div className="fabric-fall fabric-one" /><div className="fabric-fall fabric-two" /><div className="fabric-fall fabric-three" />
            <div className="hero-note">No. 01 /<br />The first light</div>
          </div>
          <div className="hero-aside"><span>01</span><span className="aside-rule" /><span>06</span></div>
        </section>

        <section className="manifesto" id="story"><p className="eyebrow">Why Saanjh</p><h2>Made slowly.<br /><em>Worn fully.</em></h2><p>We work directly with small weaving families across India to make pieces that feel like you have always owned them.</p><a className="circle-link" href="#journal" aria-label="Read our story">↘</a></section>

        <section className="collection" id="collection">
          <div className="section-heading"><div><p className="eyebrow">The edit / 01</p><h2>Pieces with<br /><em>presence.</em></h2></div><p className="section-note">Six handpicked stories,<br />ready to be yours.</p></div>
          <div className="filter-row"><div className="filters">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><span>{filteredSarees.length} pieces</span></div>
          <div className="product-grid">{filteredSarees.map((saree, index) => <article className={`product-card card-${index + 1}`} key={saree.id}>
            <button className="product-image" onClick={() => setSelected(saree)} style={{ '--accent': saree.accent }} aria-label={`View ${saree.name}`}><img src={saree.image} alt={`${saree.name} saree`} onError={(event) => { event.currentTarget.style.display = 'none' }} /><span className="image-fallback">{saree.tone}<small>Place image in /public/sarees</small></span><span className="tag">{saree.tag}</span><span className="view-mark">+</span></button>
            <div className="product-meta"><div><h3>{saree.name}</h3><p>{saree.craft}</p></div><button className={`heart ${liked.includes(saree.id) ? 'liked' : ''}`} onClick={() => toggleLike(saree.id)} aria-label={`${liked.includes(saree.id) ? 'Remove' : 'Add'} ${saree.name} ${liked.includes(saree.id) ? 'from' : 'to'} wishlist`}>{liked.includes(saree.id) ? '♥' : '♡'}</button><strong>{formatPrice(saree.price)}</strong></div>
          </article>)}</div>
        </section>

        <section className="journal" id="journal"><div><p className="eyebrow">From the journal / 03</p><h2>The art of<br /><em>taking your time.</em></h2></div><div className="journal-copy"><p>A saree is not a trend. It is a ritual of choosing yourself, one fold at a time.</p><a className="text-link" href="#story">Read the note <span>↘</span></a></div></section>
      </main>

      <footer><a className="wordmark" href="#top"><span>SAANJH</span><small>STUDIO / 2024</small></a><p>Handwoven in India<br />Worn everywhere.</p><span>© Saanjh Studio</span></footer>

      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="quick-view" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setSelected(null)} aria-label="Close quick view">×</button><div className="quick-image" style={{ '--accent': selected.accent }}><img src={selected.image} alt={selected.name} onError={(event) => { event.currentTarget.style.display = 'none' }} /><span className="image-fallback">{selected.tone}</span></div><div className="quick-copy"><p className="eyebrow">{selected.tag} / {selected.craft}</p><h2>{selected.name}</h2><strong>{formatPrice(selected.price)}</strong><p>A considered piece, woven in small batches and finished by hand. Each one carries the quiet irregularity of something made by people, not machines.</p><button className="add-button" onClick={() => { setCartCount(cartCount + 1); setSelected(null) }}>Add to bag <span>↗</span></button></div></div></div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)