### Example usage ###
Usage:

```
# Creates a functional component at cwd/[name].jsx
crc --name MyNewComponent

# Creates a functional component at cwd/[name].tsx
crc --name MyNewComponent --typescript

# Creates a class component at cwd/[name].jsx
crc --name MyNewComponent --class

# Creates a class component at cwd/components/[name].jsx
crc --name MyNewComponent --destination ./components
```

### Roadmap ###

* [x] Generate a functional component - javascript
* [x] Generate a functional component - typescript
* [x] Generate a class component - javascript
* [x] Generate a class component - typescript
* [x] User-defined crcrc.json file
* [x] User-defined output location
* [ ] User-defined templates
* [ ] Leverage yargs help functionality


### Changelog ###
**Jun 3 2020**
* chore(README): Added new goal to roadmap
* chore(cli): Deprecrating --type flag in favor of new --class flag (defaulting to functional components)
* feat(cli): Now accepting destination flag
* chore(README): Updated readme with better examples

**Jun 2 2020**
* feat(cli): Users may now provide input via crc.json file
* chore(cli): Requiring --name parameter
* chore(README): Added changelog to readme
