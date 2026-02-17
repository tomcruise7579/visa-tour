// Render blog listing page content
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('blogContainer');
    const recent = document.getElementById('recentPosts');
    if (!container) return;

    // Featured: show featured posts first
    const featured = (window.blogPosts || []).filter(p => p.type === 'featured');
    const others = (window.blogPosts || []).filter(p => p.type !== 'featured');

    const featuredHtml = featured.map(post => `
        <article class="blog-feature">
            <h2>${post.title}</h2>
            <div class="meta">${post.date} • ${post.author} • ${post.country}</div>
            <p class="excerpt">${post.excerpt}</p>
            <p class="content">${post.content}</p>
        </article>
    `).join('');

    const listHtml = others.map(p => `
        <div class="recent-item">
            <h4>${p.title}</h4>
            <small>${p.date} • ${p.country}</small>
            <p class="excerpt">${p.excerpt || ''}</p>
        </div>
    `).join('');

    container.innerHTML = featuredHtml;
    if (recent) recent.innerHTML = listHtml;
});
