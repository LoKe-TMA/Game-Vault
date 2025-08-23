// insert your block id
            const AdController = window.Adsgram.init({ blockId: "int-14145" });
            const button = document.getElementById('ad');
            button.addEventListener('click', () => {
                AdController.show().then((result) => {
                    // user watch ad till the end or close it in interstitial format
                    // your code to reward user for rewarded format
                    alert('Reward');
                }).catch((result) => {
                    // user get error during playing ad
                    // do nothing or whatever you want
                    alert(JSON.stringify(result, null, 4));
                })
            })
