const buildParamStr: (params: any) => string = (params: any) => {
    return Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
}

const redirectTo = (url: string) => {
    window.location.href = url;
}


export {
    buildParamStr,
    redirectTo
}