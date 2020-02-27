import React from 'react';
import { useObserver } from 'mobx-react-lite';
import { useStore } from '../../hooks';

export const AuditorCount = () => {

    const { mainStore } = useStore();

    return useObserver(() => (
        <div className='current-listeners-container unselectable'>
            <p className='current-listeners'>
                {
                    mainStore.auditorCount === undefined ? '' :
                        mainStore.auditorCount
                        + ' auditeur'
                        + (mainStore.auditorCount > 1 ? 's' : '')
                        + ' actuellement'
                }
            </p>
        </div>
    ));
}
