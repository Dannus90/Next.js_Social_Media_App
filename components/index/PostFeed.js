import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import NewPost from "./NewPost";
import Post from "./Post";
import {
    addPost,
    getPostFeed,
    deletePost,
    unlikePost,
    likePost,
    addComment,
    deleteComment,
} from "../../lib/api";
import { CircularProgress } from "@material-ui/core";

class PostFeed extends React.Component {
    state = {
        posts: [],
        text: "",
        image: "",
        isAddingPost: false,
        isDeletingPost: false,
    };

    componentDidMount() {
        this.postData = new FormData();
        this.getPosts();
    }

    getPosts = () => {
        const { auth } = this.props;

        getPostFeed(auth.user._id).then((posts) => {
            return this.setState({ posts });
        });
    };

    handleChange = (e) => {
        let inputValue;

        if (e.target.name === "image") {
            inputValue = e.target.files[0];
        } else {
            inputValue = e.target.value;
        }

        this.postData.set(e.target.name, inputValue);
        this.setState({ [e.target.name]: inputValue });
    };

    handleAddPost = () => {
        const { auth } = this.props;

        this.setState({ isAddingPost: true });
        addPost(auth.user._id, this.postData)
            .then((postData) => {
                const updatedPosts = [postData, ...this.state.posts];
                this.setState({
                    posts: updatedPosts,
                    isAddingPost: false,
                    text: "",
                    image: "",
                });
                this.postData.delete("image");
            })
            .catch((err) => {
                console.error(err);
                this.setState({ isAddingPost: false });
            });
    };

    handleDeletePost = (deletedPost) => {
        this.setState({ isDeletingPost: true });
        deletePost(deletedPost._id)
            .then((postData) => {
                const postIndex = this.state.posts.findIndex(
                    (post) => post._id === postData._id
                );
                const updatedPost = [
                    ...this.state.posts.slice(0, postIndex),
                    ...this.state.posts.slice(postIndex + 1),
                ];
                this.setState({
                    posts: updatedPost,
                    isDeletingPost: false,
                });
            })
            .catch((err) => {
                console.error(err);
                this.setState({ idDeletingPost: false });
            });
    };

    handleToggleLike = (post) => {
        const { auth } = this.props;

        const isPostLiked = post.likes.includes(auth.user._id);
        const sendRequest = isPostLiked ? unlikePost : likePost;
        sendRequest(post._id)
            .then((postData) => {
                const postIndex = this.state.posts.findIndex(
                    (post) => post._id === postData._id
                );
                const updatedPosts = [
                    ...this.state.posts.slice(0, postIndex),
                    postData,
                    ...this.state.posts.slice(postIndex + 1),
                ];
                this.setState({ posts: updatedPosts });
            })
            .catch((err) => console.error(err));
    };

    handleAddComment = (postId, text) => {
        const comment = { text };
        addComment(postId, comment)
            .then((postData) => {
                console.log(postData);
                const postIndex = this.state.posts.findIndex(
                    (post) => post._id === postData._id
                );
                const updatedPosts = [
                    ...this.state.posts.slice(0, postIndex),
                    postData,
                    ...this.state.posts.slice(postIndex + 1),
                ];
                this.setState({
                    posts: updatedPosts,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    handleDeleteComment = (postId, comment) => {
        deleteComment(postId, comment)
            .then((postData) => {
                const postIndex = this.state.posts.findIndex(
                    (post) => post._id === postData._id
                );
                const updatedPosts = [
                    ...this.state.posts.slice(0, postIndex),
                    postData,
                    ...this.state.posts.slice(postIndex + 1),
                ];
                this.setState({ posts: updatedPosts });
            })
            .catch((err) => console.error(err));
    };

    render() {
        const { classes, auth } = this.props;
        const { posts, text, image, isAddingPost, isDeletingPost } = this.state;
        console.log(posts);
        return (
            <div className={classes.root}>
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    color="primary"
                    className={classes.title}
                >
                    Post Feed
                </Typography>
                <NewPost
                    auth={auth}
                    text={text}
                    image={image}
                    isAddingPost={isAddingPost}
                    handleChange={this.handleChange}
                    handleAddPost={this.handleAddPost}
                />
                {posts.map((post) => (
                    <Post
                        key={post._id}
                        auth={auth}
                        post={post}
                        isDeletingPost={isDeletingPost}
                        handleDeletePost={this.handleDeletePost}
                        handleToggleLike={this.handleToggleLike}
                        handleAddComment={this.handleAddComment}
                        handleDeleteComment={this.handleDeleteComment}
                    />
                ))}
            </div>
        );
    }
}

const styles = (theme) => ({
    root: {
        paddingBottom: theme.spacing.unit * 2,
    },
    title: {
        padding: theme.spacing.unit * 2,
    },
});

export default withStyles(styles)(PostFeed);
