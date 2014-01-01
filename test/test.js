'use strict';

var stdLog = require('..');

var logger = stdLog({ level: 1 });
logger.emergency(1);
logger.alert(2);
logger.critical(3);
logger.error(4);
logger.warning(5);
logger.notice(6);
logger.info(7);
logger.debug(8);

logger.setLevel("debug");

logger.emergency(1);
logger.alert(2);
logger.critical(3);
logger.error(4);
logger.warning(5);
logger.notice(6);
logger.info(7);
logger.debug(8);

logger.setLevel(3);

logger.emergency(1);
logger.alert(2);
logger.critical(3);
logger.error(4);
logger.warning(5);
logger.notice(6);
logger.info(7);
logger.debug(8);