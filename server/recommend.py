def find_best_match(user_data, users):
    def score_match(user1, user2):
        score = 0

        # Scoring for Skills
        if user1["skills"]["skill1"] == user2["skills"]["skill1"]:
            score += 2
        if user1["skills"]["skill2"] == user2["skills"]["skill2"]:
            score += 2

        # Scoring for Personality
        if user1["personality"]["personality1"] == user2["personality"]["personality1"]:
            score += 2
        if user1["personality"]["personality2"] == user2["personality"]["personality2"]:
            score += 2

        # Scoring for Vision
        if user1["vision"]["vision1"] == user2["vision"]["vision1"]:
            score += 2
        if user1["vision"]["vision2"] == user2["vision"]["vision2"]:
            score += 2

        return score

    best_match = max(users, key=lambda user: score_match(user_data, user))
    return best_match
