// src/fontAwesomeLibrary.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import {
       faEye,
       faEyeSlash, 
       faSun, 
       faMoon,

} from '@fortawesome/free-regular-svg-icons';

// Add icons to the library
library.add(
      faCircle,
      faEye, 
      faEyeSlash, 
      faSun, 
      faMoon
);