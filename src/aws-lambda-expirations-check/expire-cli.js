

const argv = require('minimist')(process.argv.slice(2));

// usage:
const help = 
`Usage: 
	expire-cli <action> [--name] [--expire] [--id]
Examples:
	expire-cli list
	expire-cli add --name XXXX --expire "Mon 12 2018"
	expire-cli delete --id XXXXX
`;
// $ expire-cli list
// $ exc
// $ exc 
const action = argv._[0];
const name = argv['name'];
const expiresAt = argv['expire'];
const id = argv['id'];

if (!action) {
	console.log('No action specified');
	console.log(help);
	process.exit(1);
}
switch (action) {
	case 'list':
		break;
	case 'add':
		break;
	case 'delete':
		break;
	default:
		console.log(`No valid action ${action}`);
		console.log(help);
		process.exit(1);
}
