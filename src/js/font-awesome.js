import fontawesome from '@fortawesome/fontawesome'

import faBicycle from '@fortawesome/fontawesome-free-solid/faBicycle'
import faCircle from '@fortawesome/fontawesome-free-solid/faCircle'
import fatree from '@fortawesome/fontawesome-free-solid/fatree'
import fautensils from '@fortawesome/fontawesome-free-solid/faUtensils'
import famoney from '@fortawesome/fontawesome-free-solid/faMoneyBillAlt'
import faspinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import facircleonotch from '@fortawesome/fontawesome-free-solid/faCircleNotch'
import faCog from '@fortawesome/fontawesome-free-solid/faCog';

export {load };

function load() {

    fontawesome.library.add(faBicycle);
    fontawesome.library.add(faCircle);
    fontawesome.library.add(fatree);
    fontawesome.library.add(fautensils);
    fontawesome.library.add(famoney);
    fontawesome.library.add(faspinner);
    fontawesome.library.add(facircleonotch);
    fontawesome.library.add(faCog);
}