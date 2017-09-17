const MARGIN = 0;
var PADDING = 0;

const PURPLE = '#120012';
const GREEN = '#002500';
const RED = '#250000';
const BLUE = '#000025';
const SECONDARY_COLOUR = '#000015';

const TIME_INTERVAL = 15;
const PEN_START_TIME = 1500;
const PEN_DECREMENT_TIME = 0.05 * PEN_START_TIME;

const ORB_START_TIME = 6000;
const ORB_DECREMENT_TIME = 0.025 * ORB_START_TIME;

const ORB_FREQ_START_TIME = 1500;
const ORB_FREQ_DECREMENT_TIME = 0.03 * ORB_FREQ_START_TIME;

var orb_frequency = ORB_FREQ_START_TIME; /* 600 at a score of 300*/

const GAME = 'game';
const PAUSE = 'pause';
const TRANSITION = 'transition';
const LOGO = 'logo';
const HOME = 'home';

var STATE = LOGO;

var pausex;
var pausey;
var pauseside;

var PRIMARY_COLOUR = BLUE;
var DEST_COLOUR = PRIMARY_COLOUR;

var time_counter = 0;

var orb_time = ORB_START_TIME;
var pen_time = PEN_START_TIME;

var SHADOW_DIST = 0;

const LEFT = 'left';
const RIGHT = 'right';

const REGULAR = 'regular';
const DOUBLE = 'double';
const SHORT = 'short';
const BOMB = 'bomb';
const SPIKE = 'spike';

const LEVEL_TWO_SPEED_RATIO = 15;
const LEVEL_THREE_SPEED_RATIO = 10;

var arrow = new Image();
var knife = new Image();
var bomb = new Image();
var crystal = new Image();
var balloon = new Image();

var soundicon = new Image();
var soundofficon = new Image();
var homeicon = new Image();
var restarticon = new Image();

knife.src = 'data/knife.png';
arrow.src = 'data/arrow.png';
bomb.src = 'data/bomb.png';
crystal.src = 'data/diamond.png';
balloon.src = 'data/balloon.png';

soundicon.src = 'data/sound.png';
soundofficon.src = 'data/soundoff.png';
homeicon.src = 'data/home.png';
restarticon.src = 'data/restart.png';
