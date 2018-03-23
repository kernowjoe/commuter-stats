import fontawesome from '@fortawesome/fontawesome'

import faBicycle from '@fortawesome/fontawesome-free-solid/faBicycle'
import faCircle from '@fortawesome/fontawesome-free-solid/faCircle'
import faTree from '@fortawesome/fontawesome-free-solid/faTree'
import faUtensils from '@fortawesome/fontawesome-free-solid/faUtensils'
import faMoney from '@fortawesome/fontawesome-free-solid/faMoneyBillAlt'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faCircleonotch from '@fortawesome/fontawesome-free-solid/faCircleNotch'
import faCog from '@fortawesome/fontawesome-free-solid/faCog';

export {load};

function load() {

    fontawesome.library.add(
        faBicycle,
        faCircle,
        faTree,
        faUtensils,
        faMoney,
        faSpinner,
        faCircleonotch,
        faCog
    );
}
