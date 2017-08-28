'use babel'

import { CompositeDisposable } from 'atom'
import { app, globalShortcut } from 'remote'
import { config } from './config'

export default {
	config,
	subscriptions: null,
	shortcut: config.shortcut.default,

	activate(state) {
		this.subscriptions = new CompositeDisposable()

		this.subscriptions.add(
			atom.config.observe('summon.shortcut', value => {
				this.deactivateShortcut()

				try {
					const success = globalShortcut.register(value, () => {
						app.show()
						app.focus()
					})

					if (!success) {
						console.info(`The shortcut '${value}' failed to register`)
					} else {
						this.shortcut = value
					}
				} catch (e) {
					console.info(`The shortcut '${value}' failed to register`)
				}
			})
		)
	},

	deactivateShortcut() {
		try {
			globalShortcut.unregister(this.shortcut)
		} catch (e) {
			console.info('Error during shortcut unregistering')
		}
	},

	deactivate() {
		this.subscriptions.dispose()
	},

	serialize() {
		return {}
	}
}
