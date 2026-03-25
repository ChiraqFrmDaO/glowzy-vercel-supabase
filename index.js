
// Dice Roll Game
app.post('/api/casino/dice-roll', authenticate, async (req, res) => {
  try {
    const { betAmount, prediction } = req.body;
    const userId = req.user.sub;
    if (!betAmount || betAmount <= 0) return res.status(400).json({ error: 'Invalid bet amount' });
    const [balanceRows] = await pool.execute('SELECT balance FROM user_glowzycoin WHERE user_id = ?', [userId]);
    if (balanceRows.length === 0 || balanceRows[0].balance < betAmount) return res.status(400).json({ error: 'Insufficient balance' });
    const diceResult = Math.floor(Math.random() * 6) + 1;
    let winAmount = 0, won = false;
    if (prediction === 'high' && diceResult >= 4) { winAmount = betAmount * 2; won = true; }
    else if (prediction === 'low' && diceResult <= 3) { winAmount = betAmount * 2; won = true; }
    else if (prediction == diceResult) { winAmount = betAmount * 6; won = true; }
    const profitLoss = winAmount - betAmount;
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      await connection.execute('UPDATE user_glowzycoin SET balance = balance + ? WHERE user_id = ?', [profitLoss, userId]);
      await connection.execute('INSERT INTO casino_games (user_id, game_type, bet_amount, win_amount, game_result, profit_loss) VALUES (?, ?, ?, ?, ?, ?)', [userId, 'dice_roll', betAmount, winAmount, JSON.stringify({ diceResult, prediction }), profitLoss]);
      await connection.execute('INSERT INTO glowzycoin_transactions (user_id, amount, transaction_type, description) VALUES (?, ?, ?, ?)', [userId, profitLoss, won ? 'win' : 'loss', `Dice roll: ${diceResult}, prediction: ${prediction}`]);
      await connection.commit();
      res.json({ diceResult, prediction, winAmount, profitLoss, won, newBalance: balanceRows[0].balance + profitLoss });
    } catch (e) { await connection.rollback(); throw e; } finally { connection.release(); }
  } catch (error) { console.error('Dice roll error:', error); res.status(500).json({ error: 'Internal server error' }); }
});

// Daily claim status
app.get('/api/glowzycoin/daily-claim-status', authenticate, async (req, res) => {
  try {
    const userId = req.user.sub;
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await pool.execute('SELECT id FROM daily_claims WHERE user_id = ? AND claim_date = ?', [userId, today]);
    res.json({ canClaim: rows.length === 0 });
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});
