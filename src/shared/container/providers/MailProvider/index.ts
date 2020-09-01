import { container } from 'tsyringe';

import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';

const providers = {
  ethereal: EtherealMailProvider,
};

container.registerSingleton<IMailProvider>('MailProvider', providers.ethereal);
