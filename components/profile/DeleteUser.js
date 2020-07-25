import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Delete from "@material-ui/icons/Delete";
import Router from "next/router";
import { signoutUser } from "../../lib/auth";
import { deleteUser } from "../../lib/api";

class DeleteUser extends React.Component {
    state = {
        open: false,
    };

    handleDeleteUser = () => {
        const { user } = this.props;

        deleteUser(user._id)
            .then(() => {
                signoutUser();
                Router.push("/signup");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    handleOpen = () => this.setState({ open: true });

    handleClose = () => this.setState({ open: false });

    render() {
        const { open } = this.state;
        return (
            <div>
                {/* Delete Button */}
                <IconButton onClick={this.handleOpen} color="secondary">
                    <Delete />
                </IconButton>

                {/* Delete User Dialog */}
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle></DialogTitle>
                </Dialog>
            </div>
        );
    }
}

export default DeleteUser;
