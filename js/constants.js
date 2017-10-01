/* Cleaned up on Sept 22 */

const MARGIN = 0;
var PADDING = 0;
var LINE_WIDTH;

var CANVAS;
var CONTEXT;
var IMAGESET; 

const PURPLE = '#120012';
const GREEN = '#002500';
const RED = '#250000';
const BLUE = '#000025';
const SECONDARY_COLOUR = '#FFFFFF';

const TIME_INTERVAL = 15;
const PEN_START_TIME = 1500;
const PEN_DECREMENT_TIME = 0.05 * PEN_START_TIME;

const ORB_START_TIME = 6000;
const ORB_DECREMENT_TIME = 0.025 * ORB_START_TIME;

const ORB_FREQ_START_TIME = 1500;
const ORB_FREQ_DECREMENT_TIME = 0.03 * ORB_FREQ_START_TIME;

var ORB_FREQUENCY = ORB_FREQ_START_TIME;

const GAME = 'game';
const PAUSE = 'pause';
const TRANSITION = 'transition';
const LOGO = 'logo';
const HOME = 'home';

var STATE = LOGO;

var PRIMARY_COLOUR = BLUE;
var DEST_COLOUR = PRIMARY_COLOUR;

var TIME_COUNTER = 0;

var ORB_TIME = ORB_START_TIME;
var PEN_TIME = PEN_START_TIME;

const LEFT = 'left';
const RIGHT = 'right';

const REGULAR = 'regular';
const DOUBLE = 'double';
const SHORT = 'short';
const BOMB = 'bomb';
const SPIKE = 'spike';

const ZEROPI = 0.0 * Math.PI;
const TWOPI = 2.0 * Math.PI;

const TWO_SPEED_RATIO = 15;
const THREE_SPEED_RATIO = 10;

var arrow = new Image();
var knife = new Image();
var bomb = new Image();
var crystal = new Image();
var balloon = new Image();

knife.src = 'data/knife.png';
arrow.src = 'data/arrow.png';
bomb.src = 'data/bomb.png';
crystal.src = 'data/diamond.png';
balloon.src = 'data/balloon.png';
