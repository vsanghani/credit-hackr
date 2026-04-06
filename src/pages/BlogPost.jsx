import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { getBlogPostByRouteParam } from '../data/blogsData';
import { applyArticleSeo, resetToSiteDefaults } from '../utils/seo';
import './BlogPost.css';

const BlogPost = () => {
    const { id: slugOrId } = useParams();
    const post = getBlogPostByRouteParam(slugOrId);

    useEffect(() => {
        if (post) {
            applyArticleSeo(post, `/blog/${post.slug}`);
            return () => resetToSiteDefaults();
        }
        resetToSiteDefaults();
        return undefined;
    }, [post]);

    if (!post) {
        return (
            <div className="container not-found">
                <h2>Article not found</h2>
                <Link to="/blog" className="btn btn-primary">
                    Back to Blog
                </Link>
            </div>
        );
    }

    const readTime = post.readTimeMinutes;

    return (
        <div className="blog-post-page">
            <div className="post-banner-container">
                <div className="post-banner-overlay"></div>
                <img
                    src={post.banner}
                    alt={post.imageAlt || post.title}
                    className="post-banner-image"
                />
                <div className="container post-banner-content">
                    <Link to="/blog" className="back-link-white">
                        <ArrowLeft size={20} /> Back to Blog
                    </Link>
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta-light">
                        <span>
                            <Calendar size={16} /> {post.date}
                        </span>
                        <span>
                            <User size={16} /> {post.author}
                        </span>
                        {readTime ? (
                            <span>
                                <Clock size={16} /> {readTime} min read
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="container post-container">
                <article
                    className="post-content glass"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </div>
    );
};

export default BlogPost;
