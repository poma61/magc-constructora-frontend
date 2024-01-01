import { createToast } from 'mosha-vue-toastify';

const toastify = (is_type, is_message) => {
    createToast(is_message, {
        showIcon: true,
        hideProgressBar: true,
        showCloseButton: true,
        swipeClose: true,
        position: 'bottom-center',
        type: is_type,
        transition: 'slide',
    })
}//viewSnackbar

export default toastify;