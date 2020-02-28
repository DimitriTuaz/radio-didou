import { action, observable } from "mobx";

import { RootStore } from "../contexts";

export class UIStore {

    private rootStore: RootStore;

    @observable activeSidebar: boolean = false;
    @observable activeModal: string | undefined = undefined;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

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
