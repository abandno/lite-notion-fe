
import { get } from '@/utils/request';

export enum OrgApi {
  Org = '/api/org',
}

const getOrgList = () => get(OrgApi.Org, null);

export default {
  getOrgList,
};
