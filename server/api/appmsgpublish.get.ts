import {proxyMpRequest} from "~/server/utils";

interface AppMsgPublishQuery {
    page?: number
    size?: number
    id: string
    keyword: string
    token: string
}

export default defineEventHandler(async (event) => {
    const query = getQuery<AppMsgPublishQuery>(event)
    const id = query.id
    const keyword = query.keyword
    const token = query.token
    const page: number = query.page || 1
    const size: number = query.size || 5
    const begin = (page - 1) * size

    const isSearching = !!keyword

    const params: Record<string, string | number> = {
        sub: isSearching ? "search" : "list",
        search_field: isSearching ? "7" : "null",
        begin: begin.toString(),
        count: size,
        query: keyword,
        fakeid: id,
        type: "101_1",
        free_publish_type: 1,
        sub_action: "list_ex",
        token: token,
        lang: "zh_CN",
        f: "json",
        ajax: 1,
    }

    return proxyMpRequest({
        event: event,
        method: 'GET',
        endpoint: 'https://mp.weixin.qq.com/cgi-bin/appmsgpublish',
        query: params,
        parseJson: true,
    })
})
