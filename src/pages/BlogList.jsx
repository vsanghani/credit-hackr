import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { blogsData } from '../data/blogsData';
import { applyBlogIndexSeo, resetToSiteDefaults } from '../utils/seo';
import './BlogList.css';

const BlogList = () => {
    useEffect(() => {
        applyBlogIndexSeo(
            blogsData.map((p) => ({
                title: p.title,
                slug: p.slug,
                datePublished: p.datePublished,
            }))
        );
        return () => resetToSiteDefaults();
    }, []);

    return (
        <div className="blog-page">
            <div className="container">
                <div className="blog-header">
                    <h1>
                        Credit Hackr <span className="text-gradient">Blog</span>
                    </h1>
                    <p>In-depth guides on credit cards, rewards and smart spending for Australian readers.</p>
                </div>

                <div className="blog-grid">
                    {blogsData.map((post) => (
                        <article key={post.id} className="blog-card glass">
                            <div className="blog-image-wrapper">
                                <img
                                    src={post.banner}
                                    alt={post.imageAlt || post.title}
                                    loading="lazy"
                                />
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <span className="meta-item">
                                        <Calendar size={14} /> {post.date}
                                    </span>
                                    <span className="meta-item">
                                        <User size={14} /> {post.author}
                                    </span>
                                    {post.readTimeMinutes ? (
                                        <span className="meta-item">
                                            <Clock size={14} /> {post.readTimeMinutes} min
                                        </span>
                                    ) : null}
                                </div>
                                <h2 className="blog-title">{post.title}</h2>
                                <p className="blog-excerpt">{post.excerpt}</p>
                                <Link to={`/blog/${post.slug}`} className="read-more-link">
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
