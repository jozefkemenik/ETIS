import feedback from "@/components/Feedback";
import disclaimer from "@/components/DisclaimerText";
import AuthSingletonService from "@/auth/auth.singleton.service";
import Ft from "./templates/Ft";

class ModalService {
  constructor() {}


  showUserCreatedModal() {
    const h = this.$createElement
    // Using HTML string
    const titleVNode = h('div', { domProps: { innerHTML: 'User Status' } })
    // More complex structure
    const messageVNode = h('div', { class: ['foobar'] }, [
      h('p', { class: ['text-center'] }, [
        h('strong', 'Your request for user registration was sent sucessfully!'), h('br'),
        ' please check your email'
      ]),
    ])
    // We must pass the generated VNodes as arrays
    this.$bvModal.msgBoxOk([messageVNode], {
      title: [titleVNode],
      buttonSize: 'sm',
      centered: true, size: 'sm'
    })
  }

}
export default new ModalService();
