import React from 'react';
import { useObserver } from 'mobx-react-lite';
import { useStore } from '../../hooks';

export const AuditorCount = () => {

    const { nowStore } = useStore();

    return useObserver(() => (
        <div className='current-listeners-container unselectable'>
            <p className='current-listeners'>
                {
                    nowStore.auditorCount === undefined ? '' :
                        nowStore.auditorCount
                        + ' auditeur'
                        + (nowStore.auditorCount > 1 ? 's' : '')
                        + ' actuellement'
                }
            </p>
        </div>
    ));
}
