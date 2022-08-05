import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { ReactionsButtons } from './ReactionButtons';
import { TimeAgo } from './TimeAgo';
import { selectAllPosts, fetchPosts } from './postsSlice';
import { Spinner } from '../../components/Spinner';

const PostExcerpt = ({ post }) => {
    return (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user}>
                </PostAuthor>
                <TimeAgo timestamp={post.date}></TimeAgo>
            </div>
            <a className="post-content">{post.content.substring(0, 100)}</a>
            <ReactionsButtons post={post}></ReactionsButtons>
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    );
}


export const PostsList = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);



    const postStatus = useSelector(state => state.posts.status);
    const error = useSelector(state => state.posts.error);

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch])

    let content;

    if (postStatus === 'loading') {
        content = <Spinner text="Loading..."></Spinner>
    } else if (postStatus === "succeeded") {
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

        content = orderedPosts.map(post => (
            <PostExcerpt key={post.id} post={post}></PostExcerpt>
        ))
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )

}