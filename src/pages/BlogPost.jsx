import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { blogsData } from '../data/blogsData';
import './BlogPost.css';

const BlogPost = () => {
    const { id } = useParams();
    const post = blogsData.find(p => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="container not-found">
                <h2>Article not found</h2>
                <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="blog-post-page">
            <div className="post-banner-container">
                <div className="post-banner-overlay"></div>
                <img src={post.banner} alt={post.title} className="post-banner-image" />
                <div className="container post-banner-content">
                    <Link to="/blog" className="back-link-white">
                        <ArrowLeft size={20} /> Back to Blog
                    </Link>
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta-light">
                        <span><Calendar size={16} /> {post.date}</span>
                        <span><User size={16} /> {post.author}</span>
                    </div>
                </div>
            </div>

            <div className="container post-container">
                <article className="post-content glass" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </div>
    );
};

export default BlogPost;
