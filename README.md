# About TStream

TStream started as a POC to allow people to easily stream media content to their network devices using a website format with almost zero configuration.

Currently it is being built with NodeJS, React and Bootstrap components in a SPA design (Single Page Application) and no coding patterns are being used at the moment.

**WARNING:** Although you can technically serve your media files over the web with TStream, it currently does not prevent any unauthorized access and there is no SSL or any kind of encryption over the transmitted data. So I do not recommend you to do so yet.



## Usage

You must have the NPM (Node Package Manager) installed and install every library upon TStream dependencies.

### Starting the application:

Set your media location inside the **.env** file. Be warned that if you set your media directory to any root like C:\ (or "/" on linux environment) TStream will be able to read **ANY** media file in your computer. Be advised to set your media folder correctly

You must first build the application then run the production script

```shell
npm run build
npm run prod
```



## ToDo's

- [x] TStream proof of concept
- [x] README.md, licensing and usage information
- [x] Environment file (.env)
- [ ] Localization
- [ ] Executable package
- [ ] New API design
- [ ] New Home design and functionality
- [ ] Home History for easy back and forward actions
- [ ] Login protection
- [ ] SSL protection
- [ ] Mobile Application (React Native?)



## License

This software is distributed under the **[Non-Profit Open Software License version 3.0 (NPOSL-3.0)](https://opensource.org/licenses/NPOSL-3.0)**

This software is distributed as-is and any usage or consequences is at your own.