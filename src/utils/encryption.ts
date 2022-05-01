import bcrypt from 'bcrypt';
const saltRounds = 10;

function hash(plainPassword: string): string {
	const salt = bcrypt.genSaltSync(saltRounds);
	return bcrypt.hashSync(plainPassword, salt);
}

function compare(plainPassword: string, hashword: string): boolean {
	return bcrypt.compareSync(plainPassword, hashword);
}

export { hash, compare };
