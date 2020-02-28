import { action, observable } from "mobx";

export class UIStore {

    @observable activeSidebar: boolean = false;
    @observable activeModal: string | undefined = undefined;

    @action
    showSidebar = (show: boolean): void => {
        this.activeSidebar = show;
    }

    @action
    showModal = (key: string, show: boolean): void => {
        if (show)
            this.activeModal = key;
        else if (key === this.activeModal)
            this.activeModal = undefined;
    }
}
