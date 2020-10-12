

const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => { //use transaction when you want to add to more than one table at once
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*') //knex function that returns all the columns for new user
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit) //need to commit here to make sure the changes are added to table
			.catch(trx.rollback) //if anything fails, rollback the changes
		})
		.catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};