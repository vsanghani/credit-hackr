import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { blogsData } from '../data/blogsData';
import './BlogList.css';

const BlogList = () => {
    return (
        <div className="blog-page">
            <div className="container">
                <div className="blog-header">
                    <h1>Credit Hackr <span className="text-gradient">Blog</span></h1>
                    <p>Tips, tricks, and guides to mastering your finances.</p>
                </div>

                <div className="blog-grid">
                    {blogsData.map(post => (
                        <article key={post.id} className="blog-card glass">
                            <div className="blog-image-wrapper">
                                <img src={post.banner} alt={post.title} />
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <span className="meta-item"><Calendar size={14} /> {post.date}</span>
                                    <span className="meta-item"><User size={14} /> {post.author}</span>
                                </div>
                                <h2 className="blog-title">{post.title}</h2>
                                <p className="blog-excerpt">{post.excerpt}</p>
                                <Link to={`/blog/${post.id}`} className="read-more-link">
                                    Read Article <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
