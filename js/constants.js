const MARGIN = 5;
const PADDING = 10;

const PURPLE = '#9935B5';
const GREEN = '#338A28';
const RED = '#7F0000';
const BLUE = '#000015';
const SECONDARY_COLOUR = '#FFFFFF';

const TIME_INTERVAL = 15;
const PEN_START_TIME = 1500;
const PEN_DECREMENT_TIME = 0.05 * PEN_START_TIME;

const ORB_START_TIME = 6000;
const ORB_DECREMENT_TIME = 0.025 * ORB_START_TIME;

const ORB_FREQ_START_TIME = 1500;
const ORB_FREQ_DECREMENT_TIME = 0.03 * ORB_FREQ_START_TIME;

var orb_frequency = ORB_FREQ_START_TIME; /* 600 at a score of 300*/

var PRIMARY_COLOUR = BLUE;
var DEST_COLOUR = PRIMARY_COLOUR;

var time_counter = 0;

var orb_time = ORB_START_TIME;
var pen_time = PEN_START_TIME;

const LEFT = 'left';
const RIGHT = 'right';

const REGULAR = 'regular';
const BALLOON = 'balloon';
const SLOW_DOWN = 'slow_down';
const POISON = 'poison';
const SPIKE = 'spike';

const x13start = 15;
const x16start = 10;

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
