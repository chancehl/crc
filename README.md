### Example usage ###
Usage:

```
crc --name MyNewComponent
crc --name MyNewComponent --typescript
crc --name MyNewComponent --type class
```

### Roadmap ###

* [x] Generate a functional component - javascript
* [x] Generate a functional component - typescript
* [x] Generate a class component - javascript
* [x] Generate a class component - typescript
* [x] User-defined crcrc.json file
* [ ] User-defined output location
* [ ] User-defined templates
* [ ] Leverage yargs help functionality


### Changelog ###
**Jun 3 2020**
* chore(README): Added new goal to roadmap
* chore(cli): Deprecrating --type flag in favor of new --class flag (defaulting to functional components)

**Jun 2 2020**
* feat(cli): Users may now provide input via crc.json file
* chore(cli): Requiring --name parameter
* chore(README): Added changelog to readme
