(function(){

    angular
        .module("FreshApp")
        .constant("Fresh.SurveyConstants", {
            RespondentType: {
                Player: 1,
                Coach: 2,
                AthleticTrainer: 3
            },

            TypeOfSurvey: {
                PrePractice: 1,
                PostPractice: 2
            },
        })
})(angular);